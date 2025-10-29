# Learn about building .NET container images:
# https://github.com/dotnet/dotnet-docker/blob/main/samples/README.md

# === Build Stage ===
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

# Install Node.js tooling for SPA build steps
RUN apt-get update \
    && apt-get install -y --no-install-recommends nodejs npm \
    && rm -rf /var/lib/apt/lists/*

# Copy only project file(s) and restore dependencies first
COPY HelloWeb/*.csproj ./HelloWeb/
WORKDIR /source/HelloWeb
RUN dotnet restore --runtime linux-x64

# Copy the remaining source files
COPY HelloWeb/. ./

# Publish the app (self-contained for Linux-x64)
RUN dotnet publish -c Release --runtime linux-x64 --no-restore -o /app

# === Runtime Stage ===
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app ./
EXPOSE 8080

# Run as non-root user (DigitalOcean sets APP_UID automatically)
USER $APP_UID
ENTRYPOINT ["dotnet", "HelloWeb.dll"]
ENTRYPOINT ["./HelloWeb"]
