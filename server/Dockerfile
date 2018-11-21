ARG CONTRACTS_BUILDER_IMAGE=acuerdo-smart-contracts
FROM ${CONTRACTS_BUILDER_IMAGE} as smart-contracts

FROM gradle:jdk8-slim as server-builder
USER root
COPY src ./src
COPY web3 ./web3
COPY --from=smart-contracts /build .
RUN bash ./web3/generate-from-build.sh ./contracts
COPY build.gradle settings.gradle ./
RUN gradle build --no-daemon --no-build-cache --no-scan --configure-on-demand -i
RUN mv ./build/libs/*.jar /app.jar

FROM openjdk:8-jdk-alpine
COPY --from=server-builder /app.jar .
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","app.jar"]