FROM microsoft/dotnet:2.2-sdk AS build-env

# BEGIN MODIFICATION - Node is needed for development (but not production)
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
# END MODIFICATION

WORKDIR /sln

# copy solution
COPY *.sln ./


# Copy csproj and restore as distinct layers
COPY ./client/*.csproj ./client/
COPY ./CommonLib/*.csproj ./CommonLib/
COPY ./xplatform/*.csproj ./xplatform/
RUN dotnet restore

# Copy everything else and build
COPY ./client ./client
COPY ./CommonLib ./CommonLib
COPY ./xplatform ./xplatform

RUN dotnet publish "./xplatform/xplatform.csproj" -c Release -o /out

COPY ./xplatform/xplatform.dev.db /out

# Build runtime image
FROM microsoft/dotnet:2.2-aspnetcore-runtime
WORKDIR /app
COPY --from=build-env /out .
ENTRYPOINT ["dotnet", "xplatform.dll"]