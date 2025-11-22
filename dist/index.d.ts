/**
 * Dokploy GitHub Action - Main Entry Point
 * Version: 1.0.0
 * Author: SSanjeevi
 *
 * This action provides complete Dokploy lifecycle management including:
 * - Project and environment management
 * - Server resolution
 * - Application creation/update
 * - Docker provider configuration
 * - Environment variable management
 * - Domain and SSL configuration
 * - Health check verification with deployment failure marking
 * - Comprehensive error handling and debugging
 *
 * Important: If health check is enabled and fails, the deployment will be
 * marked as failed even if the container deployment succeeded. This ensures
 * users are aware when the new version is not functioning correctly.
 */
export declare function run(): Promise<void>;
