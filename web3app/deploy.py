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

def upload_files():
    print("=" * 50)
    print("CyberEx Web3 App - FTP Deployment")
    print("=" * 50)
    print()
    
    ftp_user = input("FTP Kullanıcı Adı: ")
    ftp_pass = input("FTP Şifre: ")
    
    try:
        print(f"\n[*] {FTP_SERVER} sunucusuna bağlanılıyor...")
        ftp = ftplib.FTP(FTP_SERVER)
        ftp.login(ftp_user, ftp_pass)
        print("[+] Bağlantı başarılı!")
        
        # Remote dizine geç
        try:
            ftp.cwd(REMOTE_DIR)
        except:
            print(f"[*] {REMOTE_DIR} klasörü oluşturuluyor...")
            ftp.mkd(REMOTE_DIR)
            ftp.cwd(REMOTE_DIR)
        
        # Dosyaları yükle
        local_path = Path(LOCAL_DIR)
        files_to_upload = [
            "index.html",
            "style.css",
            "script.js",
            ".htaccess"
        ]
        
        print(f"\n[*] Dosyalar yükleniyor...")
        for filename in files_to_upload:
            filepath = local_path / filename
            if filepath.exists():
                with open(filepath, 'rb') as file:
                    print(f"  → {filename} yükleniyor...")
                    ftp.storbinary(f'STOR {filename}', file)
                    print(f"  ✓ {filename} yüklendi!")
            else:
                print(f"  ⚠ {filename} bulunamadı!")
        
        ftp.quit()
        print("\n[+] Yükleme tamamlandı!")
        print(f"\nTest: https://cyberex.com.tr/web3app")
        
    except Exception as e:
        print(f"\n[!] Hata: {e}")
        print("\nManuel yükleme için:")
        print("1. FileZilla veya cPanel File Manager kullan")
        print(f"2. {LOCAL_DIR} klasöründeki dosyaları {REMOTE_DIR} klasörüne yükle")

if __name__ == "__main__":
    upload_files()


