FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /sln

# copy solution
COPY *.sln .


# Copy csproj and restore as distinct layers
COPY Messaging/*.csproj ./Messaging/
COPY CommonLib/*.csproj ./CommonLib/
COPY migrationUtils/*.csproj ./migrationUtils/
COPY PriceUpdater/*.csproj ./PriceUpdater/
COPY XCub/*.csproj ./XCub/
COPY xplatform/*.csproj ./xplatform/
RUN dotnet restore

# Copy everything else and build
COPY CommonLib/. ./CommonLib/
COPY migrationUtils/. ./migrationUtils/
COPY Messaging/. ./Messaging/
COPY PriceUpdater/. ./PriceUpdater/
COPY XCub/. ./XCub/
COPY xplatform/. ./xplatform/
WORKDIR /sln/xplatform
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build-env /sln/xplatform/out ./
ENTRYPOINT ["dotnet", "xplatform.dll"]