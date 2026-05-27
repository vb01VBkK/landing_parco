/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  db, 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { DynamicIcon } from './DynamicIcon';

interface FirestoreLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  message: string;
  bookVisit: boolean;
  requestBrochure: boolean;
  createdAt: any;
  status: 'new' | 'contacted' | 'archived';
}

interface BrokerConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  localLeads: any[];
}

export const BrokerConsole: React.FC<BrokerConsoleProps> = ({ isOpen, onClose, localLeads }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cloudLeads, setCloudLeads] = useState<FirestoreLead[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'contacted' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setCloudLeads([]);
        setErrorMessage(null);
      }
    });
    return unsubscribe;
  }, []);

  // Securely listen to Firestore leads under live query only when authenticated
  useEffect(() => {
    if (!currentUser) return;

    setIsSyncing(true);
    setErrorMessage(null);

    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leads: FirestoreLead[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        leads.push({
          id: doc.id,
          name: data.name,
          phone: data.phone,
          email: data.email,
          propertyType: data.propertyType,
          message: data.message || '',
          bookVisit: !!data.bookVisit,
          requestBrochure: !!data.requestBrochure,
          createdAt: data.createdAt,
          status: data.status || 'new',
        });
      });
      setCloudLeads(leads);
      setIsSyncing(false);
    }, (error) => {
      setIsSyncing(false);
      
      // If permissions are missing (e.g. they authenticated with a personal account that is not the admin)
      if (error.message.includes('permission') || error.code === 'permission-denied') {
        setErrorMessage("Accesso Cloud Negato: Il tuo account Google non è abilitato come Broker ufficiale. Vengono mostrati i lead locali.");
      } else {
        try {
          handleFirestoreError(error, OperationType.LIST, 'leads');
        } catch (e: any) {
          setErrorMessage(e.message);
        }
      }
    });

    return unsubscribe;
  }, [currentUser]);

  if (!isOpen) return null;

  const handleAuth = async () => {
    try {
      setErrorMessage(null);
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMessage("Errore di autenticazione: " + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleStatusChange = async (leadId: string, currentStatus: any, newStatus: 'new' | 'contacted' | 'archived') => {
    const leadPath = `leads/${leadId}`;
    try {
      const leadRef = doc(db, 'leads', leadId);
      
      // Submit status change representing secure update
      await updateDoc(leadRef, {
        status: newStatus
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, leadPath);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa richiesta dal cloud?")) return;
    const leadPath = `leads/${leadId}`;
    try {
      await deleteDoc(doc(db, 'leads', leadId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, leadPath);
    }
  };

  const displayLeads = currentUser && !errorMessage ? cloudLeads : localLeads.map(l => ({
    ...l,
    id: l.id || String(Math.random()),
    status: l.status || 'new'
  }));

  const filteredLeads = displayLeads.filter(lead => {
    const matchesFilter = activeFilter === 'all' || lead.status === activeFilter;
    const searchTarget = `${lead.name} ${lead.email} ${lead.phone} ${lead.propertyType}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div 
      id="broker-crm-overlay" 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-end"
    >
      <div 
        id="broker-crm-sidebar" 
        className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-[#00e676]/10 text-[#00e676] rounded-xl">
              <DynamicIcon name="Award" size={20} />
            </span>
            <div>
              <h3 className="text-base font-bold tracking-tight">Console Broker & CRM</h3>
              <p className="text-[10px] text-slate-400">Gestisci i contatti del Parco Oleandri</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <DynamicIcon name="X" size={16} />
          </button>
        </div>

        {/* Authentication Panel */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col space-y-3">
          {currentUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Broker avatar" className="w-8 h-8 rounded-full ring-2 ring-emerald-400" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-550 text-white flex items-center justify-center font-bold">
                    {currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800">{currentUser.displayName || 'Consulente Immobiliare'}</span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{currentUser.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                  <span>Cloud Live</span>
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-[11px] font-semibold text-red-650 hover:text-red-700 cursor-pointer transition"
                >
                  Esci
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Connetti il Database Cloud</h4>
                <p className="text-[10px] text-slate-500">Accedi come Broker per sincronizzare e aggiornare i record sul cloud.</p>
              </div>
              <button 
                onClick={handleAuth}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center space-x-2 transition cursor-pointer shrink-0"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google logo" />
                <span>Accedi con Google</span>
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start space-x-1.5 leading-relaxed text-left">
              <span className="mt-0.5 text-amber-500 shrink-0 select-none">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="p-4 bg-white border-b border-slate-100 flex flex-col space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-405">
              🔍
            </span>
            <input 
              type="text"
              placeholder="Cerca nome, telefono o alloggio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-500 transition"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight border transition cursor-pointer ${
                activeFilter === 'all' 
                  ? 'bg-slate-900 border-slate-900 text-white' 
                  : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
              }`}
            >
              Tutti ({displayLeads.length})
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight border transition cursor-pointer ${
                activeFilter === 'new' 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-slate-200 text-blue-600 hover:bg-blue-50'
              }`}
            >
              Nuovi ({displayLeads.filter(l => l.status === 'new').length})
            </button>
            <button
              onClick={() => setActiveFilter('contacted')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight border transition cursor-pointer ${
                activeFilter === 'contacted' 
                  ? 'bg-emerald-650 border-emerald-650 text-white' 
                  : 'bg-white border-slate-200 text-emerald-600 hover:bg-blue-50'
              }`}
            >
              Contattati ({displayLeads.filter(l => l.status === 'contacted').length})
            </button>
            <button
              onClick={() => setActiveFilter('archived')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight border transition cursor-pointer ${
                activeFilter === 'archived' 
                  ? 'bg-slate-500 border-slate-500 text-white' 
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-blue-50'
              }`}
            >
              Archiviati ({displayLeads.filter(l => l.status === 'archived').length})
            </button>
          </div>
        </div>

        {/* List content area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {isSyncing && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs">
              <svg className="animate-spin h-6 w-6 text-slate-500 mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Sincronizzazione in corso...</span>
            </div>
          )}

          {!isSyncing && filteredLeads.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nessun lead corrispondente ai filtri trovati.
            </div>
          )}

          {!isSyncing && filteredLeads.map((lead) => (
            <div 
              key={lead.id} 
              className={`p-4 bg-white rounded-2xl border ${
                lead.status === 'new' 
                  ? 'border-blue-100 shadow-sm shadow-blue-50/50' 
                  : 'border-slate-100'
              } flex flex-col space-y-3 text-left`}
            >
              {/* Card top */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 text-sm tracking-tight">{lead.name}</span>
                  <span className="text-[10px] text-slate-400">
                    {lead.createdAt?.seconds 
                      ? new Date(lead.createdAt.seconds * 1000).toLocaleString() 
                      : 'Data di invio locale'}
                  </span>
                </div>
                
                <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  lead.status === 'new' 
                    ? 'bg-blue-50 text-blue-700' 
                    : lead.status === 'contacted'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-150 text-slate-600'
                }`}>
                  {lead.propertyType}
                </span>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                <div className="flex items-center space-x-1">
                  <span className="text-slate-400">📞</span>
                  <a href={`tel:${lead.phone}`} className="font-bold text-slate-700 hover:underline">{lead.phone}</a>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-slate-400">✉️</span>
                  <a href={`mailto:${lead.email}`} className="font-bold text-slate-700 hover:underline truncate max-w-[120px]" title={lead.email}>{lead.email}</a>
                </div>
                {lead.bookVisit && (
                  <span className="text-emerald-700 font-semibold flex items-center space-x-0.5">
                    <span>✓</span> <span className="font-sans">Visita in cantiere</span>
                  </span>
                )}
                {lead.requestBrochure && (
                  <span className="text-blue-700 font-semibold flex items-center space-x-0.5">
                    <span>✓</span> <span>Brochure PDF</span>
                  </span>
                )}
              </div>

              {lead.message && (
                <div className="text-[11px] text-slate-600 leading-relaxed bg-amber-50/20 p-2.5 rounded-xl border border-amber-100/30">
                  <strong className="text-slate-500 font-medium">Nota dell'utente:</strong>
                  <p className="mt-0.5 font-normal">{lead.message}</p>
                </div>
              )}

              {/* Action Operations exclusive to signed-in Admin */}
              {currentUser && !errorMessage ? (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex space-x-1.5">
                    {lead.status !== 'contacted' && (
                      <button
                        onClick={() => handleStatusChange(lead.id, lead.status, 'contacted')}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg transition duration-150 cursor-pointer"
                      >
                        ✓ Contattato
                      </button>
                    )}
                    {lead.status !== 'archived' && (
                      <button
                        onClick={() => handleStatusChange(lead.id, lead.status, 'archived')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg transition duration-150 cursor-pointer"
                      >
                        Archivia
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="text-red-500 hover:text-red-650 text-[10px] font-bold p-1 cursor-pointer"
                    title="Elimina definitivo"
                  >
                    Elimina
                  </button>
                </div>
              ) : (
                <div className="pt-1.5 text-[9px] text-slate-400 border-t border-slate-50 text-right">
                  * Accedi per sbloccare le azioni cloud sul CRM.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
