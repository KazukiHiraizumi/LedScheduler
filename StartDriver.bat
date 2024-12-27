@powershell -NoProfile -ExecutionPolicy Unrestricted "$s=[scriptblock]::create((gc \"%~f0\"|?{$_.readcount -gt 1})-join\"`n\");&$s" %*&goto:eof

rem Start-Process -WindowStyle Minimized python "drv\ledsch.py"
Start-Process -NoNewWindow python "drv\ledsch.py"
cd ui
Start-Process -NoNewWindow python "-m http.server"
