export interface Campaign {
  id: string;
  title: string;
  description: string;
  type: 'promotion' | 'announcement' | 'event' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: number;
  endDate?: number;
  imageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  createdAt: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: number;
}

export class CampaignManager {
  private static readonly CAMPAIGNS_KEY = 'cyberex_campaigns';
  private static readonly ANNOUNCEMENTS_KEY = 'cyberex_announcements';
  
  // Kampanya oluştur (admin için)
  static async createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt'>): Promise<Campaign> {
    const newCampaign: Campaign = {
      ...campaign,
      id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    };
    
    const campaigns = await this.getAllCampaigns();
    campaigns.push(newCampaign);
    await chrome.storage.local.set({ [this.CAMPAIGNS_KEY]: campaigns });
    
    return newCampaign;
  }
  
  // Aktif kampanyaları getir
  static async getActiveCampaigns(): Promise<Campaign[]> {
    const campaigns = await this.getAllCampaigns();
    const now = Date.now();
    
    return campaigns.filter(c => {
      if (!c.isActive) return false;
      if (c.startDate > now) return false;
      if (c.endDate && c.endDate < now) return false;
      return true;
    }).sort((a, b) => {
      // Priority'ye göre sırala
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  // Duyuru oluştur
  static async createAnnouncement(
    announcement: Omit<Announcement, 'id' | 'isRead' | 'createdAt'>
  ): Promise<Announcement> {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isRead: false,
      createdAt: Date.now()
    };
    
    const announcements = await this.getAllAnnouncements();
    announcements.unshift(newAnnouncement); // En yeni en üstte
    await chrome.storage.local.set({ [this.ANNOUNCEMENTS_KEY]: announcements });
    
    return newAnnouncement;
  }
  
  // Okunmamış duyuruları getir
  static async getUnreadAnnouncements(): Promise<Announcement[]> {
    const announcements = await this.getAllAnnouncements();
    return announcements.filter(a => !a.isRead);
  }
  
  // Duyuruyu okundu olarak işaretle
  static async markAnnouncementAsRead(id: string): Promise<void> {
    const announcements = await this.getAllAnnouncements();
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      announcement.isRead = true;
      await chrome.storage.local.set({ [this.ANNOUNCEMENTS_KEY]: announcements });
    }
  }
  
  static async getAllCampaigns(): Promise<Campaign[]> {
    const result = await chrome.storage.local.get(this.CAMPAIGNS_KEY);
    return result[this.CAMPAIGNS_KEY] || [];
  }
  
  static async getAllAnnouncements(): Promise<Announcement[]> {
    const result = await chrome.storage.local.get(this.ANNOUNCEMENTS_KEY);
    return result[this.ANNOUNCEMENTS_KEY] || [];
  }
  
  // Kampanya sil
  static async deleteCampaign(id: string): Promise<void> {
    const campaigns = await this.getAllCampaigns();
    const filtered = campaigns.filter(c => c.id !== id);
    await chrome.storage.local.set({ [this.CAMPAIGNS_KEY]: filtered });
  }
  
  // Duyuru sil
  static async deleteAnnouncement(id: string): Promise<void> {
    const announcements = await this.getAllAnnouncements();
    const filtered = announcements.filter(a => a.id !== id);
    await chrome.storage.local.set({ [this.ANNOUNCEMENTS_KEY]: filtered });
  }
}

