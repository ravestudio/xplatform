﻿FROM microsoft/dotnet:2.1-sdk AS build-env

# BEGIN MODIFICATION - Node is needed for development (but not production)
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get install -y nodejs
# END MODIFICATION

WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ./xplatform/*.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY ./xplatform ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM microsoft/dotnet:2.1-aspnetcore-runtime-stretch-slim-arm32v7
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "xplatform.dll"]