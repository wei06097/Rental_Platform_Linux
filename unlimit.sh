# 暫時
# sudo sysctl fs.inotify.max_user_watches=524288 
# sudo sysctl -p

# 永久
echo fs.inotify.max_user_watches = 524288 | sudo tee -a /etc/sysctl.conf 
sudo sysctl -p