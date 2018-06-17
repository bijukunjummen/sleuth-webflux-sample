FROM java:8
RUN mkdir /app
ADD build/libs/sample-client-app-0.0.1-SNAPSHOT.jar /app/app.jar
ADD docker/runboot.sh /app/
RUN bash -c 'touch /app/app.jar'
WORKDIR /app
RUN chmod a+x runboot.sh
EXPOSE 8080
CMD /app/runboot.sh