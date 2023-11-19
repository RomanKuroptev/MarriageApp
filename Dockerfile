#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["./MarriageAPI/MarriageAPI.csproj", "MarriageAPI/"]
RUN dotnet restore "./MarriageAPI/MarriageAPI.csproj"
COPY . .
WORKDIR "/src/MarriageAPI"
RUN dotnet build "MarriageAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MarriageAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MarriageAPI.dll"]