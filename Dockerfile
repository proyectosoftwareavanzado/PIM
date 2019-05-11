FROM node

WORKDIR /opt/pim
add . /opt/pim
RUN npm install --quiet
RUN npm install nodemon -g --quiet


EXPOSE 8082

CMD npm start