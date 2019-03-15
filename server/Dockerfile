ARG CONTRACTS_BUILDER_IMAGE=acuerdo-smart-contracts
FROM ${CONTRACTS_BUILDER_IMAGE} as smart-contracts

FROM gradle:jdk8-slim as server-builder
USER root
COPY src ./server/src
COPY web3 ./server/web3
COPY web3/web3j-3.6.0 /home/gradle/server/web3j-3.6.0
COPY --from=smart-contracts /builds /home/smart-contract/builds
COPY build.gradle settings.gradle ./server/
RUN cd server && gradle build --no-daemon --no-build-cache --no-scan --configure-on-demand -i
RUN mv ./server/build/libs/*.jar /app.jar

FROM openjdk:8-jdk-alpine
COPY --from=server-builder /app.jar .
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","app.jar"]