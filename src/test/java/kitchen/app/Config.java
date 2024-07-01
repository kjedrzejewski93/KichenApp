package kitchen.app;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class Config {
    private Properties properties;
    public Config(){
        properties = new Properties();
        try{
            FileInputStream input = new FileInputStream("src/test/java/resources/variables.properties");
            properties.load(input);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String getBaseUrl(){
        return properties.getProperty("baseUrl");
    }
    public String getUsername(){
        return properties.getProperty("username");
    }
    public String getPassword(){
        return properties.getProperty("password");
    }
    public String getAdminName(){
        return properties.getProperty("adminname");
    }
    public String getAdminPassword(){
        return properties.getProperty("adminpassword");
    }

}