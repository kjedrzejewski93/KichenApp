package kitchen.app;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class KitchenApplicationTests {

	private Config config;
	private WebDriver driver;
	WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

	private String generateUniqueLogin() {
		// Użycie LocalDateTime do uzyskania aktualnego czasu
		LocalDateTime now = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
		String formattedNow = now.format(formatter);

		// Generowanie loginu
		return "user" + formattedNow;
	}


	@Before
	public void setUp() {
		WebDriverManager.chromedriver().setup();
		config = new Config();
		driver = new ChromeDriver();
		driver.get(config.getBaseUrl());
	}

	@Test
	public void testLoginUser(){
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

		WebElement usernameField = driver.findElement(By.id("username"));
		WebElement passwordField = driver.findElement(By.id("password"));
		WebElement loginButton = driver.findElement(By.id("loginButton"));

		usernameField.sendKeys(config.getUsername());
		passwordField.sendKeys(config.getPassword());
		loginButton.click();

		WebElement welcomeMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcomeMessage")));
		assertEquals("Witaj, " + config.getUsername() + "!", welcomeMessage.getText());

		WebElement welcomeUser = driver.findElement(By.id("panelTitle"));
		assertEquals("User Panel", welcomeUser.getText());


	}

	@Test
	public void testLoginAdmin(){
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

		WebElement usernameField = driver.findElement(By.id("username"));
		WebElement passwordField = driver.findElement(By.id("password"));
		WebElement loginButton = driver.findElement(By.id("loginButton"));

		usernameField.sendKeys(config.getAdminName());
		passwordField.sendKeys(config.getAdminPassword());
		loginButton.click();

		WebElement welcomeMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcomeMessage")));
		assertEquals("Witaj, " + config.getAdminName() + "!", welcomeMessage.getText());

		WebElement welcomeUser = driver.findElement(By.id("panelTitle"));
		assertEquals("Admin Panel", welcomeUser.getText());

	}

	@Test
	public void createAccount(){
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
		String uniqueLogin = generateUniqueLogin();


		WebElement usernameField = driver.findElement(By.id("username"));
		WebElement passwordField = driver.findElement(By.id("password"));
		WebElement registerButton = driver.findElement(By.id("createAccountButton"));
		WebElement loginButton = driver.findElement(By.id("loginButton"));

		usernameField.sendKeys(uniqueLogin);
		passwordField.sendKeys(config.getPassword());
		registerButton.click();

		WebElement correctCreate = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("message")));
		assertEquals("Dodano prawidłowo", correctCreate.getText());

		usernameField.sendKeys(uniqueLogin);
		passwordField.sendKeys(config.getPassword());
		loginButton.click();

		WebElement welcomeMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcomeMessage")));
		assertEquals("Witaj, " + uniqueLogin + "!", welcomeMessage.getText());

	}

	@Test
	public void shopByUser(){
		WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

		WebElement usernameField = driver.findElement(By.id("username"));
		WebElement passwordField = driver.findElement(By.id("password"));
		WebElement loginButton = driver.findElement(By.id("loginButton"));

		usernameField.sendKeys(config.getUsername());
		passwordField.sendKeys(config.getPassword());
		loginButton.click();

		WebElement welcomeMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcomeMessage")));
		assertEquals("Witaj, " + config.getUsername() + "!", welcomeMessage.getText());

		WebElement welcomeUser = driver.findElement(By.id("panelTitle"));
		assertEquals("User Panel", welcomeUser.getText());

		driver.findElement(By.id("ordersToByButton")).click();

		WebElement addSupplierTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("addSuppTitle")));
		assertEquals("Dodaj Dostawcę", addSupplierTitle.getText());

		driver.findElement(By.id("checkAvButton")).click();

		WebElement addProductTitle = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("addProTitle")));
		assertEquals("Dodaj Produkt", addProductTitle.getText());

		WebElement addFirstUnit = driver.findElement(By.id("unit-8"));
		addFirstUnit.sendKeys("kg");
		WebElement addFirstItem = driver.findElement(By.id("quantity-8"));
		addFirstItem.sendKeys("10");
		List<WebElement> addButtonsFirst = driver.findElements(By.xpath("//button[text()='Dodaj']"));
		if (!addButtonsFirst.isEmpty()) {
			addButtonsFirst.get(0).click();
		}

		WebElement addSecondUnit = driver.findElement(By.id("unit-10"));
		addSecondUnit.sendKeys("szt");
		WebElement addSecondItem = driver.findElement(By.id("quantity-10"));
		addSecondItem.sendKeys("6");
		List<WebElement> addButtonsSecond = driver.findElements(By.xpath("//button[text()='Dodaj']"));
		if (!addButtonsSecond.isEmpty()) {
			addButtonsSecond.get(2).click();
		}

		driver.findElement(By.id("goToOrder")).click();

		WebElement titleOrder = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("orderTitle")));
		assertEquals("Zamówienie", titleOrder.getText());

		driver.findElement(By.id("sendOrder")).click();


	}

	@After
	public void tearDown() {
//		try {
//			// Zatrzymanie testu na 5 sekund
//			Thread.sleep(5000);
//		} catch (InterruptedException e) {
//			e.printStackTrace();
//		}
		if (driver != null) {
			driver.quit();
		}
	}

}
