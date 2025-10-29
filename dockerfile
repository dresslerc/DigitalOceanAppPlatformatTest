# Build stage for React frontend
FROM node:18-alpine AS client-build
WORKDIR /app/clientapp

# Copy package files and install dependencies
COPY HelloWeb/clientapp/package*.json ./
RUN npm ci

# Copy client app source and build
COPY HelloWeb/clientapp/ ./
RUN npm run build

# Build stage for .NET backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY HelloWeb/*.csproj ./
RUN dotnet restore

# Copy everything else (excluding clientapp since we'll copy the built version)
COPY HelloWeb/ ./

# Copy the built React app from client-build stage BEFORE publishing
COPY --from=client-build /app/clientapp/build ./clientapp

RUN dotnet publish -c Release -o out

# Ensure the clientapp folder is included in the publish output
RUN cp -r ./clientapp ./out/clientapp/build

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copy published app
COPY --from=build /app/out .

# Expose port
EXPOSE 8080
EXPOSE 443

ENTRYPOINT ["dotnet", "HelloWeb.dll"]