-- CreateTable for EnodeToken
CREATE TABLE "EnodeToken" (
    "id" SERIAL PRIMARY KEY,
    "token" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EnodeToken_token_key" UNIQUE ("token")
);

-- CreateTable for Vehicle
CREATE TABLE "Vehicle" (
    "id" SERIAL PRIMARY KEY,
    "vehicleId" VARCHAR(191) NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "vin" VARCHAR(191) NOT NULL,
    "model" VARCHAR(191) NOT NULL,
    "year" INT NOT NULL,
    "batteryCapacity" INT NOT NULL,
    "ownerID" INT NOT NULL,
    "soc" INT NOT NULL,
    "dateOfConnection" TIMESTAMP NOT NULL,
    "odometerFloat" FLOAT NOT NULL,
    "usageAverageDailyKmDriven" FLOAT[] NOT NULL,
    "monthlyUsage" FLOAT[] NOT NULL,
    "condition" VARCHAR(191) NOT NULL,
    "status" VARCHAR(191) NOT NULL,
    "make" VARCHAR(191) NOT NULL,
    "batteryHealthSoH" FLOAT NOT NULL,
    "batteryHealthDegradation" FLOAT NOT NULL,
    "location" VARCHAR(191) NOT NULL DEFAULT 'Bangalore, India',
    "soh" FLOAT[] NOT NULL,
    "batteryHealthAverageEstimatedDegradation" FLOAT[] NOT NULL,
    "batteryHealthAverageSoC" FLOAT NOT NULL,
    "batteryHealthTotalBatteries" INT NOT NULL,
    "connectorType" VARCHAR(191) NOT NULL,
    "endOfLife" VARCHAR(191) NOT NULL,
    "realRangeObserved" INT NOT NULL,
    "remainingUsefulLife" VARCHAR(191) NOT NULL,
    "totalChargingSession" INT NOT NULL,
    "totalEnergyConsumed" VARCHAR(191) NOT NULL,
    "vehicleConditionCritical" INT NOT NULL,
    "vehicleConditionGood" INT NOT NULL,
    "vehicleConditionSatisfactory" INT NOT NULL,
    "vehicleStatusActive" INT NOT NULL,
    "vehicleStatusCharging" INT NOT NULL,
    "vehicleStatusInUse" INT NOT NULL,
    "vehicleStatusOutOfService" INT NOT NULL,
    "epawltpProvidedRange" INT NOT NULL,
    "usageRangeObservedMax" INT NOT NULL,
    "usageRangeObservedMin" INT NOT NULL,
    "usageSoCRangeMax" INT NOT NULL,
    "usageSoCRangeMin" INT NOT NULL,
    "usageTemperatureHigh" INT NOT NULL,
    "usageTemperatureLow" INT NOT NULL,
    "batteryChemistry" VARCHAR(191) NOT NULL DEFAULT 'Lithium-ion',
    "batteryHealthAverageSoH" FLOAT NOT NULL,
    "dataPointsCollected" INT NOT NULL,
    "averageMonthlyUsage" FLOAT NOT NULL
);

-- Add Foreign Key Constraints
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
