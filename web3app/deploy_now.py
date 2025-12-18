#!/usr/bin/env python3
"""
CyberEx Web3 App - Otomatik FTP Deployment
cyberex.com.tr/web3app için
"""

import os
import ftplib
from pathlib import Path

FTP_SERVER = "cyberex.com.tr"
LOCAL_DIR = "web"
REMOTE_DIR = "/public_html/web3app"

def upload_files(ftp_user, ftp_pass):
    print("=" * 50)
    print("CyberEx Web3 App - FTP Deployment")
    print("=" * 50)
    print()
    
    try:
        print(f"[*] {FTP_SERVER} sunucusuna bağlanılıyor...")
        ftp = ftplib.FTP(FTP_SERVER)
        ftp.login(ftp_user, ftp_pass)
        print("[+] Bağlantı başarılı!")
        
        # public_html'e geç
        try:
            ftp.cwd("/public_html")
            print("[+] public_html klasörüne geçildi")
        except:
            print("[!] public_html klasörü bulunamadı, root'ta devam ediliyor...")
        
        # web3app klasörünü oluştur veya geç
        try:
            ftp.cwd("web3app")
            print("[+] web3app klasörüne geçildi")
        except:
            print("[*] web3app klasörü oluşturuluyor...")
            try:
                ftp.mkd("web3app")
                ftp.cwd("web3app")
                print("[+] web3app klasörü oluşturuldu")
            except Exception as e:
                print(f"[!] Klasör oluşturulamadı: {e}")
                print("[*] Mevcut klasöre yükleniyor...")
        
        # Dosyaları yükle
        local_path = Path(LOCAL_DIR)
        files_to_upload = [
            "index.html",
            "style.css",
            "script.js",
            ".htaccess",
            "CNAME",
            "README.md"
        ]
        
        print(f"\n[*] Dosyalar yükleniyor...")
        uploaded = 0
        for filename in files_to_upload:
            filepath = local_path / filename
            if filepath.exists():
                try:
                    with open(filepath, 'rb') as file:
                        print(f"  → {filename} yükleniyor...", end=" ")
                        ftp.storbinary(f'STOR {filename}', file)
                        print("✓")
                        uploaded += 1
                except Exception as e:
                    print(f"✗ Hata: {e}")
            else:
                print(f"  ⚠ {filename} bulunamadı (atlanıyor)")
        
        ftp.quit()
        print(f"\n[+] Yükleme tamamlandı! ({uploaded} dosya yüklendi)")
        print(f"\n✅ Test: https://cyberex.com.tr/web3app")
        return True
        
    except ftplib.error_perm as e:
        print(f"\n[!] FTP Hatası: {e}")
        print("\nKontrol et:")
        print("  - FTP kullanıcı adı ve şifre doğru mu?")
        print("  - FTP erişim izinleri var mı?")
        return False
    except Exception as e:
        print(f"\n[!] Hata: {e}")
        return False

if __name__ == "__main__":
    # FTP bilgileri buraya gelecek
    import sys
    
    if len(sys.argv) >= 3:
        ftp_user = sys.argv[1]
        ftp_pass = sys.argv[2]
        upload_files(ftp_user, ftp_pass)
    else:
        print("Kullanım: python deploy_now.py <ftp_user> <ftp_pass>")
        print("VEYA")
        ftp_user = input("FTP Kullanıcı Adı: ")
        ftp_pass = input("FTP Şifre: ")
        upload_files(ftp_user, ftp_pass)


