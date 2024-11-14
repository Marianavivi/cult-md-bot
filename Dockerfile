FROM quay.io/gurusensei/gurubhay:latest

RUN git clone https://github.com/Marianavivi/cult-md-bot /root/culture

WORKDIR /root/culture/

RUN npm install --platform=linuxmusl

EXPOSE 5000

CMD ["npm", "start"]
