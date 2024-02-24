# # Global args
# ARG BASE_DEBIAN=bookworm-slim

# ################################################################################
# # We utilize this small alpine layer to cache the downloaded xampp installer
# ################################################################################
# from alpine/curl as xampp_downloader
# ARG XAMPP_URL
# RUN curl -Lo xampp-linux-installer.run https://altushost-swe.dl.sourceforge.net/project/xampp/XAMPP%20Linux/8.2.4/xampp-linux-x64-8.2.4-0-installer.run

# ################################################################################
# # Here, we build the xampp image
# ################################################################################
# FROM debian:${BASE_DEBIAN}
# LABEL maintainer="Tomas Jasek<tomsik68 (at) gmail (dot) com>"

# ENV DEBIAN_FRONTEND noninteractive

# # Set root password to root, format is 'user:password'.
# RUN echo 'root:root' | chpasswd

# # See https://docs.docker.com/develop/develop-images/instructions/#apt-get for apt-get guidelines
# RUN apt-get update --fix-missing && \
#   # curl is needed to download the xampp installer, net-tools provides netstat command for xampp
#   apt-get install -y --no-install-recommends curl net-tools openssh-server \
#       supervisor nano vim less && \
#   rm -rf /var/lib/apt/lists/*

# COPY --from=xampp_downloader xampp-linux-installer.run .
# RUN chmod +x xampp-linux-installer.run && \
#   bash -c './xampp-linux-installer.run' && \
#   # Delete the installer after it's done to make the resulting image smaller
#   rm xampp-linux-installer.run && \
#   ln -sf /opt/lampp/lampp /usr/bin/lampp && \
#   # Enable XAMPP web interface(remove security checks)
#   sed -i.bak s'/Require local/Require all granted/g' /opt/lampp/etc/extra/httpd-xampp.conf && \
#   # Enable error display in php
#   sed -i.bak s'/display_errors=Off/display_errors=On/g' /opt/lampp/etc/php.ini && \
#   # Enable includes of several configuration files
#   mkdir /opt/lampp/apache2/conf.d && \
#   echo "IncludeOptional /opt/lampp/apache2/conf.d/*.conf" >> /opt/lampp/etc/httpd.conf && \
#   # Create a /www folder and a symbolic link to it in /opt/lampp/htdocs. It'll be accessible via http://localhost:[port]/www/
#   # This is convenient because it doesn't interfere with xampp, phpmyadmin or other tools in /opt/lampp/htdocs
#   mkdir /www && \
#   ln -s /www /opt/lampp/htdocs && \
#   # SSH server
#   mkdir -p /var/run/sshd && \
#   # Allow root login via password
#   sed -ri 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/g' /etc/ssh/sshd_config

# # copy supervisor config file to start openssh-server
# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# VOLUME [ "/var/log/mysql/", "/var/log/apache2/", "/www", "/opt/lampp/apache2/conf.d/" ]

# EXPOSE 3306
# EXPOSE 22
# EXPOSE 80
# EXPOSE 3000
# CMD ["/usr/bin/supervisord", "-n"]

# # CMD ["npm", "dev"]
FROM node:18

WORKDIR /booking
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run dev
