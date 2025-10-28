using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");
app.MapGet("/envar", () => Environment.GetEnvironmentVariable("SQLCS"));
//app.MapGet("/db", async () => await Database.GetData());

app.MapGet("/db", async () =>
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

app.Run();
