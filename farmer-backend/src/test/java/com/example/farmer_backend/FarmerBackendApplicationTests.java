package com.example.farmer_backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.blankOrNullString;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest
class FarmerBackendApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void farmerSigninReturnsTokenForFrontendRedirect() throws Exception {
		mockMvc.perform(post("/api/farmer/signin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"farmerId":"FARM001","password":"Farmer@123"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token", not(blankOrNullString())))
				.andExpect(jsonPath("$.user.farmerId").value("FARM001"))
				.andExpect(jsonPath("$.user.role").value("FARMER"))
				.andExpect(jsonPath("$.message").value("Login successful"));
	}

	@Test
	void publicSigninReturnsTokenForFrontendRedirect() throws Exception {
		mockMvc.perform(post("/api/public/signin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"email":"public@example.com","password":"Public@123"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token", not(blankOrNullString())))
				.andExpect(jsonPath("$.user.email").value("public@example.com"))
				.andExpect(jsonPath("$.user.role").value("PUBLIC"))
				.andExpect(jsonPath("$.message").value("Login successful"));
	}

	@Test
	void invalidFarmerSigninReturnsJson401() throws Exception {
		mockMvc.perform(post("/api/farmer/signin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"farmerId":"FARM001","password":"wrong"}
								"""))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Invalid farmer ID or password"));
	}

	@Test
	void farmerApplicationAcceptsFrontendFields() throws Exception {
		mockMvc.perform(post("/api/farmer/apply")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{
								  "name":"Kannan",
								  "phone":"9876543210",
								  "location":"Thanjavur",
								  "landPattaNo":"LP-1",
								  "kisanCardNo":"KC-1",
								  "coopSocietyNo":"CS-1"
								}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.message").value("Application submitted successfully"));
	}

	@Test
	void protectedFarmerProfileAndFeedWorkWithToken() throws Exception {
		String signinJson = mockMvc.perform(post("/api/farmer/signin")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"farmerId":"FARM001","password":"Farmer@123"}
								"""))
				.andExpect(status().isOk())
				.andReturn()
				.getResponse()
				.getContentAsString();

		String token = signinJson.replaceAll(".*\\\"token\\\":\\\"([^\\\"]+)\\\".*", "$1");

		mockMvc.perform(get("/api/farmer/1/profile")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Kannan"))
				.andExpect(jsonPath("$.totalSales").value(0.0))
				.andExpect(jsonPath("$.rating").value(0.0));

		MockMultipartFile file = new MockMultipartFile(
				"file",
				"beans.jpg",
				"image/jpeg",
				"image-bytes".getBytes()
		);

		mockMvc.perform(multipart("/api/products/upload")
						.file(file)
						.param("name", "Green Beans")
						.param("price", "34.5")
						.param("description", "Fresh beans from the farm")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Green Beans"))
				.andExpect(jsonPath("$.imageUrl", startsWith("http://localhost:8080/uploads/")));

		mockMvc.perform(get("/api/products/feed")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(content().string(org.hamcrest.Matchers.containsString("Green Beans")))
				.andExpect(content().string(org.hamcrest.Matchers.containsString("http://localhost:8080/uploads/")));
	}

}
