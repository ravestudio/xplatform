FROM mcr.microsoft.com/dotnet/core/sdk:3.1.101 AS build-env

WORKDIR /sln

# copy solution
COPY *.sln .


# Copy csproj and restore as distinct layers
COPY client/*.csproj ./client/
COPY CommonLib/*.csproj ./CommonLib/
COPY xplatform/*.csproj ./xplatform/
RUN dotnet restore

# Copy everything else and build
COPY client/. ./client/
COPY CommonLib/. ./CommonLib/
COPY xplatform/. ./xplatform/
WORKDIR /sln/xplatform
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS runtime
WORKDIR /app
COPY --from=build-env /sln/xplatform/out ./
ENTRYPOINT ["dotnet", "xplatform.dll"]