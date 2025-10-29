# Learn about building .NET container images:
# https://github.com/dotnet/dotnet-docker/blob/main/samples/README.md

# === Build Stage ===
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG TARGETARCH
WORKDIR /source
 
# Copy only project file(s) and restore dependencies first
COPY HelloWeb/*.csproj ./HelloWeb/
WORKDIR /source/HelloWeb
RUN dotnet restore --runtime linux-${TARGETARCH}

# Copy the remaining source files
COPY HelloWeb/. ./

# Publish the app (self-contained for Linux-x64)
RUN dotnet publish -c Release --runtime linux-${TARGETARCH} --no-restore -o /app

# === Runtime Stage ===
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app ./
EXPOSE 8080

# Run as non-root user (DigitalOcean sets APP_UID automatically)
USER $APP_UID
ENTRYPOINT ["dotnet", "HelloWeb.dll"]
ENTRYPOINT ["./HelloWeb"]
