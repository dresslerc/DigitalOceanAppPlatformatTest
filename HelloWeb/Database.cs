using Npgsql;

public class Database
{ 
    public static async Task<string> GetData() {

        // connection string — adjust for your environment
        var connString = Environment.GetEnvironmentVariable("SQLCS");

        await using var conn = new NpgsqlConnection(connString);
        await conn.OpenAsync();

        var sql = "SELECT name FROM table1";

        await using var cmd = new NpgsqlCommand(sql, conn);
        await using var reader = await cmd.ExecuteReaderAsync();

        string output = "";
        while (await reader.ReadAsync())
        {
            output += reader.GetString(0) + "\n";
 
        }

        return output;
    }   

}