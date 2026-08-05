import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { ContactInfo } from '../../types';
import { Plus, Trash2, Save, MapPin, Mail, Phone, Type, Menu } from 'lucide-react';

export const AdminContacts: React.FC = () => {
  const { contacts, updateContact, addContact, deleteContact, siteSettings, updateSiteSetting } = useSiteData();
  
  // Header State
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerTitleTr, setHeaderTitleTr] = useState('');
  const [headerId, setHeaderId] = useState<string | null>(null);

  // Menu Settings State
  const [navCommTitle, setNavCommTitle] = useState('');
  const [navCommTitleTr, setNavCommTitleTr] = useState('');
  const [navContactsTitle, setNavContactsTitle] = useState('');
  const [navContactsTitleTr, setNavContactsTitleTr] = useState('');

  // New Card State
  const [newTitle, setNewTitle] = useState('');
  const [newTitleTr, setNewTitleTr] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newAddressTr, setNewAddressTr] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    const header = contacts.find(c => c.type === 'header');
    if (header) {
        setHeaderTitle(header.title);
        setHeaderTitleTr(header.title_tr || '');
        setHeaderId(header.id);
    }

    setNavCommTitle(siteSettings?.find(s => s.key === 'nav_communication_title')?.value || 'İletişim');
    setNavCommTitleTr(siteSettings?.find(s => s.key === 'nav_communication_title_tr')?.value || '');
    setNavContactsTitle(siteSettings?.find(s => s.key === 'nav_contacts_title')?.value || 'Kişiler');
    setNavContactsTitleTr(siteSettings?.find(s => s.key === 'nav_contacts_title_tr')?.value || '');
  }, [contacts, siteSettings]);

  const handleUpdateHeader = async () => {
      if (headerId) {
          await updateContact(headerId, { title: headerTitle, title_tr: headerTitleTr });
          alert('Başlık güncellendi!');
      } else {
          // Create if not exists (though SQL should have created it)
          await addContact({
              type: 'header',
              title: headerTitle,
              title_tr: headerTitleTr,
              sort_order: 0
          });
      }
  };

  const handleUpdateMenuSettings = async () => {
      await updateSiteSetting('nav_communication_title', navCommTitle);
      await updateSiteSetting('nav_communication_title_tr', navCommTitleTr);
      await updateSiteSetting('nav_contacts_title', navContactsTitle);
      await updateSiteSetting('nav_contacts_title_tr', navContactsTitleTr);
      alert('Menü ayarları güncellendi!');
  };

  const handleAddCard = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTitle) return;

      await addContact({
          type: 'card',
          title: newTitle,
          title_tr: newTitleTr,
          address: newAddress,
          address_tr: newAddressTr,
          email: newEmail,
          phone: newPhone,
          sort_order: contacts.length + 1
      });

      setNewTitle('');
      setNewTitleTr('');
      setNewAddress('');
      setNewAddressTr('');
      setNewEmail('');
      setNewPhone('');
  };

  const handleDelete = async (id: string) => {
      if (confirm('Bu iletişim kartını silmek istediğinizden emin misiniz?')) {
          await deleteContact(id);
      }
  };

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-condensed uppercase mb-8">İletişim Yönetimi</h2>

      {/* Menu Settings Section */}
      <div className="bg-[#151515] p-8 rounded-xl border border-stone-800 h-fit mb-12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <Menu size={20} /> Navigasyon Menü Başlıkları
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">İletişim Menü Başlığı</label>
                  <input
                      type="text"
                      value={navCommTitle}
                      onChange={(e) => setNavCommTitle(e.target.value)}
                      className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                      placeholder="İletişim"
                  />
              </div>
              <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-yellow-600 block mb-2">İletişim Menü Başlığı (Türkçe)</label>
                  <input
                      type="text"
                      value={navCommTitleTr}
                      onChange={(e) => setNavCommTitleTr(e.target.value)}
                      className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                  />
              </div>
              <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">Kişiler Bağlantı Başlığı</label>
                  <input
                      type="text"
                      value={navContactsTitle}
                      onChange={(e) => setNavContactsTitle(e.target.value)}
                      className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                      placeholder="Kişiler"
                  />
              </div>
              <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-yellow-600 block mb-2">Kişiler Bağlantı Başlığı (Türkçe)</label>
                  <input
                      type="text"
                      value={navContactsTitleTr}
                      onChange={(e) => setNavContactsTitleTr(e.target.value)}
                      className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                  />
              </div>
          </div>
          <div className="flex justify-end pt-4">
              <button
                  onClick={handleUpdateMenuSettings}
                  className="bg-white text-black px-6 py-2 rounded-lg font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors flex items-center gap-2"
              >
                  <Save size={16} /> Menü Başlıklarını Güncelle
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Main Header Section */}
          <div className="bg-[#151515] p-8 rounded-xl border border-stone-800 h-fit">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Type size={20} /> Ana Adres Başlığı
              </h3>
              <div className="space-y-4">
                  <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">Başlık Metni</label>
                      <input
                          type="text"
                          value={headerTitle}
                          onChange={(e) => setHeaderTitle(e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                          placeholder="örn. VIA DELLA SPIGA 34..."
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-yellow-600 block mb-2">Başlık Metni (Türkçe)</label>
                      <input
                          type="text"
                          value={headerTitleTr}
                          onChange={(e) => setHeaderTitleTr(e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                      />
                  </div>
                  <button
                      onClick={handleUpdateHeader}
                      className="bg-white text-black px-6 py-2 rounded-lg font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors flex items-center gap-2"
                  >
                      <Save size={16} /> Başlığı Güncelle
                  </button>
              </div>
          </div>

          {/* Add New Card Section */}
          <div className="bg-[#151515] p-8 rounded-xl border border-stone-800 h-fit">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Plus size={20} /> Yeni İletişim Kartı Ekle
              </h3>
              <form onSubmit={handleAddCard} className="space-y-4">
                  <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">Kart Başlığı</label>
                      <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                          placeholder="örn. SHOWROOM"
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-yellow-600 block mb-2">Card Title (Türkçe)</label>
                      <input
                          type="text"
                          value={newTitleTr}
                          onChange={(e) => setNewTitleTr(e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                          placeholder="ör. SERGİ SALONU"
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">Adres</label>
                      <textarea
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none h-24"
                          placeholder="Adres detayları..."
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-yellow-600 block mb-2">Adres (Türkçe)</label>
                      <textarea
                          value={newAddressTr}
                          onChange={(e) => setNewAddressTr(e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none h-24"
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">E-posta</label>
                          <input
                              type="text"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              onMouseDown={(e) => e.stopPropagation()}
                              className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                              placeholder="eposta@ornek.com"
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">Telefon</label>
                          <input
                              type="text"
                              value={newPhone}
                              onChange={(e) => setNewPhone(e.target.value)}
                              onMouseDown={(e) => e.stopPropagation()}
                              className="w-full p-3 bg-black border border-stone-800 text-white rounded-lg focus:border-white outline-none"
                              placeholder="+90..."
                          />
                      </div>
                  </div>
                  <div className="flex justify-end pt-2">
                      <button
                          type="submit"
                          className="bg-white text-black px-6 py-2 rounded-lg font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors"
                      >
                          Kart Ekle
                      </button>
                  </div>
              </form>
          </div>
      </div>

      {/* Existing Cards List */}
      <div className="mt-12">
          <h3 className="text-xl font-bold mb-6 text-white border-b border-stone-800 pb-4">Mevcut İletişim Kartları</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.filter(c => c.type === 'card').map(card => (
                  <div key={card.id} className="bg-[#151515] p-6 rounded-xl border border-stone-800 group relative">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                              onClick={() => handleDelete(card.id)}
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                          >
                              <Trash2 size={14} />
                          </button>
                      </div>
                      
                      <h4 className="text-lg font-bold text-white mb-4 uppercase">{card.title}</h4>
                      
                      <div className="space-y-3 text-stone-400 text-sm">
                          {card.address && (
                              <div className="flex gap-3">
                                  <MapPin size={16} className="shrink-0 mt-1" />
                                  <p className="whitespace-pre-line">{card.address}</p>
                              </div>
                          )}
                          {card.email && (
                              <div className="flex gap-3 items-center">
                                  <Mail size={16} className="shrink-0" />
                                  <p>{card.email}</p>
                              </div>
                          )}
                          {card.phone && (
                              <div className="flex gap-3 items-center">
                                  <Phone size={16} className="shrink-0" />
                                  <p>{card.phone}</p>
                              </div>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
