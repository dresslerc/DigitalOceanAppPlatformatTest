using System.Text.Json;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSpaStaticFiles(config =>
{
    config.RootPath = "clientapp/build";
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// app.MapGet("/", () => "Hello World!");
app.MapGet("/api/envar", () => Environment.GetEnvironmentVariable("SQLCS"));
//app.MapGet("/db", async () => await Database.GetData());

app.MapGet("/api/db", async () =>
{
    var data = await Database.GetData(); // returns string[]

    var options = new JsonSerializerOptions
    {
        WriteIndented = true, // pretty print
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase, // camelCase keys
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    var json = JsonSerializer.Serialize(data, options);

    return Results.Content(json, "application/json"); // or "text/html", "text/plain", etc.
});

// SPA integration
app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), spaApp =>
{
    spaApp.UseSpa(spa =>
    {
        spa.Options.SourcePath = "ClientApp";

        if (app.Environment.IsDevelopment())
        {
            spa.UseReactDevelopmentServer(npmScript: "start");
        }
    });
});


app.Run();
