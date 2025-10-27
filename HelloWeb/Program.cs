var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");
app.MapGet("/envar", () => Environment.GetEnvironmentVariable("SQLCS"));
app.MapGet("/db", async () => await Database.GetData());

app.Run();
