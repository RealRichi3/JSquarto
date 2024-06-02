import { ValueOf } from "../interfaces";
import logger from "./logger";
import config from "../../config.json";

export interface Config {
    outputDirectory: string;
    sourceDirectory: string;
    tutorialDirectory: string;
    translationsDirectory: string;
    includeLocalizedVersions: boolean;
    languages: string[];
}

export interface ConfigMap {
    source: "sourceDirectory";
    output: "outputDirectory";
    tutorial: "tutorialDirectory";
    include_localized_versions: "includeLocalizedVersions";
    languages: "languages";
    translations: "translationsDirectory";
}

type CliArgs = Partial<{ [k in keyof ConfigMap]: string }>;

export default class ConfigMgr {
    private static CONFIG = {
        outputDirectory: config.outputDirectory,
        sourceDirectory: config.sourceDirectory,
        tutorialDirectory: config.tutorialDirectory,
        translationsDirectory: config.translationsDirectory,
        includeLocalizedVersions: config.includeLocalizedVersions,
        languages: config.languages,
    } as Config;
    private static currentWorkingDirectory: string;

    // keys are the cli arguments, values are the config keys
    static configMap: ConfigMap = {
        source: "sourceDirectory",
        output: "outputDirectory",
        tutorial: "tutorialDirectory",
        include_localized_versions: "includeLocalizedVersions",
        languages: "languages",
        translations: "translationsDirectory",
    } as const;

    static getArgsFromCli() {
        const args = process.argv.slice(2);
        const argMap = new Map<string, string>();

        // Find working directory
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (arg.startsWith("workingDir")) {
                // Directory where user called the `jsq` command from
                // Will be used to resolve relative paths
                this.currentWorkingDirectory = arg.split("=")[1];
                break;
            }
        }

        if (!this.currentWorkingDirectory) {
            logger.error("No working directory provided");
            process.exit(1);
        }

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            let [key, value] = arg.split("=");

            argMap.set(key.startsWith("--") ? key.slice(2) : key, value);
        }

        return argMap;
    }

    static updateConfigStore(): { config: Config; inputData: Partial<Config> } {
        const cliArgs = this.getArgsFromCli();

        const currentConfig = this.CONFIG;
        const configToUpdate = {} as Config;
        for (const entries of cliArgs.entries()) {
            let [cliKey, cliValue] = entries as [
                keyof CliArgs,
                ValueOf<CliArgs>,
            ];
            if (cliValue) {
                const _key = this.configMap[cliKey];
                if (_key === "languages") {
                    configToUpdate[_key] = cliValue.split(",");
                } else if (_key === "includeLocalizedVersions") {
                    configToUpdate[_key] = cliValue ? true : false;
                } else {
                    configToUpdate[_key] = cliValue;
                }
            } else {
                logger.warn(`No value provided for ${cliKey}`);
            }
        }

        const updatedConfig = { ...currentConfig, ...configToUpdate };

        logger.info("Updating config store...", {
            meta: {
                updatedConfig,
                newData: configToUpdate,
            },
        });
        for (let [key, value] of Object.entries(updatedConfig)) {
            if (key === "languages") {
                this.CONFIG.languages = value as string[];
            } else {
                if (
                    key === "sourceDirectory" ||
                    key === "outputDirectory" ||
                    key === "tutorialDirectory" ||
                    key === "translationsDirectory"
                ) {
                    value = `${this.currentWorkingDirectory}/${value}`;
                }

                this.CONFIG[
                    key as
                        | "outputDirectory"
                        | "sourceDirectory"
                        | "tutorialDirectory"
                        | "translationsDirectory"
                ] = value as string;
            }
        }

        return {
            inputData: configToUpdate,
            config: updatedConfig,
        };
    }

    static getConfig() {
        this.updateConfigStore();
        return this.CONFIG;
    }
}
