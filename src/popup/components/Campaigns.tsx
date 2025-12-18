import React, { useState, useEffect } from 'react';
import { CampaignManager, Campaign, Announcement } from '../../services/campaignManager';

interface CampaignsProps {
  onNavigate: (view: string) => void;
}

const Campaigns: React.FC<CampaignsProps> = ({ onNavigate }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'announcements'>('campaigns');

  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.querySelector('.campaigns-container');
    if (container) {
      container.scrollTop = 0;
    }
    loadData();
  }, []);

  const loadData = async () => {
    const [camp, ann] = await Promise.all([
      CampaignManager.getActiveCampaigns(),
      CampaignManager.getUnreadAnnouncements()
    ]);
    setCampaigns(camp);
    setAnnouncements(ann);
  };

  const handleAnnouncementRead = async (id: string) => {
    await CampaignManager.markAnnouncementAsRead(id);
    await loadData();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion': return '🎁';
      case 'announcement': return '📢';
      case 'event': return '🎉';
      case 'warning': return '⚠️';
      default: return '📌';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'promotion': return '#00ffff';
      case 'announcement': return '#0080ff';
      case 'event': return '#ff00ff';
      case 'warning': return '#ffaa00';
      default: return '#00ffff';
    }
  };

  return (
    <div className="campaigns-container">
      <div className="header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ← Geri
        </button>
        <h2>Kampanyalar & Duyurular</h2>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          Kampanyalar ({campaigns.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          Duyurular ({announcements.length})
        </button>
      </div>

      {activeTab === 'campaigns' && (
        <div className="campaigns-list">
          {campaigns.length === 0 ? (
            <div className="empty-state">
              <p>Henüz aktif kampanya yok</p>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="campaign-card"
                style={{ borderColor: getTypeColor(campaign.type) }}
              >
                <div className="campaign-header">
                  <span className="campaign-icon">{getTypeIcon(campaign.type)}</span>
                  <div className="campaign-title-section">
                    <h3>{campaign.title}</h3>
                    <span className="campaign-priority">{campaign.priority}</span>
                  </div>
                </div>
                <p className="campaign-description">{campaign.description}</p>
                {campaign.linkUrl && (
                  <a
                    href={campaign.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="campaign-link"
                  >
                    Detaylar →
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="announcements-list">
          {announcements.length === 0 ? (
            <div className="empty-state">
              <p>Yeni duyuru yok</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`announcement-card ${announcement.type} ${!announcement.isRead ? 'unread' : ''}`}
                onClick={() => handleAnnouncementRead(announcement.id)}
              >
                <div className="announcement-header">
                  <h3>{announcement.title}</h3>
                  {!announcement.isRead && <span className="unread-badge">Yeni</span>}
                </div>
                <p>{announcement.content}</p>
                <div className="announcement-date">
                  {new Date(announcement.createdAt).toLocaleDateString('tr-TR')}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Campaigns;


