package com.example.farmer_backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@jakarta.persistence.Entity
@Table(name = "farmers")
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("location")
    private String location;

    @JsonProperty("landPattaNo")
    private String landPattaNo;

    @JsonProperty("kisanCardNo")
    private String kisanCardNo;

    @JsonProperty("coopSocietyNo")
    private String coopSocietyNo;

    // Default status pending
    private String status = "PENDING";

    // Admin approve panna aprom vara pōra data
    private String farmerId;
    private String password;

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getLandPattaNo() { return landPattaNo; }
    public void setLandPattaNo(String landPattaNo) { this.landPattaNo = landPattaNo; }
    public String getKisanCardNo() { return kisanCardNo; }
    public void setKisanCardNo(String kisanCardNo) { this.kisanCardNo = kisanCardNo; }
    public String getCoopSocietyNo() { return coopSocietyNo; }
    public void setCoopSocietyNo(String coopSocietyNo) { this.coopSocietyNo = coopSocietyNo; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}