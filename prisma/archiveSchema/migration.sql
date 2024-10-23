-- CreateTable: EnodeToken
CREATE TABLE "EnodeToken" (
    "id" SERIAL PRIMARY KEY,
    "token" VARCHAR(191) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the unique index after the table is created
CREATE UNIQUE INDEX "EnodeToken_token_key" ON "EnodeToken" ("token");

-- CreateTable: Vehicle
CREATE TABLE "Vehicle" (
    "id" VARCHAR(191) NOT NULL,
    "make" VARCHAR(191) NOT NULL,
    "model" VARCHAR(191) NOT NULL,
    "year" INTEGER NOT NULL,
    "vin" VARCHAR(191) NULL,
    "odometer" DOUBLE PRECISION NULL,
    "batteryCapacity" DOUBLE PRECISION NULL,
    "ownerId" INTEGER NOT NULL,
    "dateOfConnection" TIMESTAMPTZ NOT NULL,
    "soc" DOUBLE PRECISION NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);

-- CreateTable: VehicleDashboardData
CREATE TABLE "VehicleDashboardData" (
    "id" SERIAL PRIMARY KEY,
    "vehicleId" VARCHAR(191) NULL,
    "location" VARCHAR(191) NOT NULL DEFAULT 'Banglore',
    "datapointsCollected" INTEGER NOT NULL DEFAULT 1410,
    "totalEnergyConsumed" DOUBLE PRECISION NOT NULL,
    "averageSoC" DOUBLE PRECISION NOT NULL,
    "connectorType" VARCHAR(191) NOT NULL,
    "totalChargingSessions" INTEGER NOT NULL,
    "averageChargingRate" DOUBLE PRECISION NOT NULL,
    "avgDailyKmDriven" INTEGER NOT NULL,
    "temperatureLow" INTEGER NOT NULL,
    "temperatureHigh" INTEGER NOT NULL,
    "socRangeMin" INTEGER NOT NULL,
    "socRangeMax" INTEGER NOT NULL,
    "rangeObservedMin" INTEGER NOT NULL,
    "rangeObservedMax" INTEGER NOT NULL,
    "realRangeObserved" INTEGER NOT NULL,
    "epaProvidedRange" INTEGER NOT NULL,
    "batteryHealthSoH" DOUBLE PRECISION NOT NULL,
    "estimatedDegradation" DOUBLE PRECISION NOT NULL,
    "batteryChemistry" VARCHAR(191) NOT NULL DEFAULT 'Li-ion',
    "endOfLife" TIMESTAMPTZ NOT NULL,
    "remainingUsefulLife" INTEGER NOT NULL
);

-- Create the unique index after the table is created
CREATE UNIQUE INDEX "VehicleDashboardData_vehicleId_key" ON "VehicleDashboardData" ("vehicleId");

-- CreateTable: Car
CREATE TABLE "Car" (
    "id" SERIAL PRIMARY KEY,
    "brand" VARCHAR(191) NOT NULL,
    "model" VARCHAR(191) NOT NULL,
    "year" VARCHAR(191) NOT NULL,
    "type" VARCHAR(191) NOT NULL,
    "integration_status" VARCHAR(191) NOT NULL,
    "activation_required" VARCHAR(191) NULL,
    "regions" VARCHAR(191) NOT NULL,
    "reliability" VARCHAR(191) NOT NULL,
    "capabilities" VARCHAR(191) NOT NULL,
    "information" VARCHAR(191) NOT NULL,
    "charge_state" VARCHAR(191) NOT NULL,
    "location" VARCHAR(191) NOT NULL,
    "start_stop_commands" VARCHAR(191) NOT NULL,
    "smart_charging" VARCHAR(191) NOT NULL,
    "scheduling" VARCHAR(191) NOT NULL,
    "statistics" VARCHAR(191) NOT NULL
);

-- AddForeignKey: Vehicle.ownerId -> User.id
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: VehicleDashboardData.vehicleId -> Vehicle.id
ALTER TABLE "VehicleDashboardData" ADD CONSTRAINT "VehicleDashboardData_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
