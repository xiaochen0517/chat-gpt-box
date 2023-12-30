import {migrateFunctions} from "./MigrationFunctions";

export class StoreDataMigration {

  private readonly migrateFunctions: Array<() => void>;

  constructor() {
    this.migrateFunctions = migrateFunctions;
  }

  private static getCurrentVersion(): number {
    console.log("Current version: " + import.meta.env.VITE_STORE_VERSION);
    return Number(import.meta.env.VITE_STORE_VERSION);
  }

  public static migrate(): void {
    const currentVersion = this.getCurrentVersion();
    const storedVersion = localStorage.getItem("version");
    if (!storedVersion) {
      if (localStorage.length > 0) localStorage.clear();
      localStorage.setItem("version", currentVersion.toString());
      // refresh page
      window.location.reload();
      return;
    }
    const storedVersionNumber = parseInt(storedVersion);
    if (storedVersionNumber < currentVersion) {
      const migration = new StoreDataMigration();
      migration.migrateFromVersion(storedVersionNumber, currentVersion);
    }
  }

  public migrateFromVersion(fromVersion: number, toVersion: number): void {
    console.log("Migrate from version " + fromVersion + " to " + toVersion);
    for (let currentMigrateVersion = fromVersion; currentMigrateVersion < toVersion; currentMigrateVersion++) {
      this.migrateFunctions[currentMigrateVersion - 1]();
    }
    localStorage.setItem("version", toVersion.toString());
  }

}