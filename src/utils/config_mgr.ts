import CONFIG, { Config, ConfigMap } from "../config";
import { ValueOf } from "../interfaces";
import logger from "./logger";

type CliArgs = Partial<{ [k in keyof ConfigMap]: string }>;
export default class ConfigMgr {
    // keys are the cli arguments, values are the config keys
    static configMap: ConfigMap = {
        source: "sourceDirectory",
        tutorial: "tutorialDirectory",
        include_localized_versions: "includeLocalizedVersions",
        languages: "languages",
        translations: "translationsDirectory",
    } as const;

    static getArgsFromCli() {
        const args = process.argv.slice(2);
        const argMap = new Map<string, string>();

        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            const [key, value] = arg.split("=");
            argMap.set(key.startsWith("--") ? key.slice(2) : key, value);
        }

        return argMap;
    }

    static updateConfigStore(): { config: Config; inputData: Partial<Config> } {
        const cliArgs = this.getArgsFromCli();

        const currentConfig = CONFIG;
        const configToUpdate = {} as Config;
        for (const entries of cliArgs.entries()) {
            const [cliKey, cliValue] = entries as [
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
        for (const [key, value] of Object.entries(updatedConfig)) {
            if (key === "languages") {
                CONFIG.languages = value as string[];
            } else {
                CONFIG[
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
}