﻿FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env

WORKDIR /sln

# copy solution
COPY *.sln .


# Copy csproj and restore as distinct layers
COPY PriceUpdater/*.csproj ./PriceUpdater/
COPY CommonLib/*.csproj ./CommonLib/
COPY xplatform/*.csproj ./xplatform/
RUN dotnet restore

# Copy everything else and build
COPY PriceUpdater/. ./PriceUpdater/
COPY CommonLib/. ./CommonLib/
COPY xplatform/. ./xplatform/
WORKDIR /sln/xplatform
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build-env /sln/xplatform/out ./
ENTRYPOINT ["dotnet", "xplatform.dll"]