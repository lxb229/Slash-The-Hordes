import { Vec2, Node } from "cc";
import { ISignal } from "../../../../Services/EventSystem/ISignal";
import { roundToOneDecimal } from "../../../../Services/Utils/MathUtils";
import { HaloLauncherSettings } from "../../../Data/GameSettings";
import { ProjectileCollision } from "../../../Projectile/ProjectileCollision";
import { IProjectileCollisionSignaler } from "../../../Projectile/IProjectileCollisionSignaler";
import { ProjectileData, ProjectileLauncher } from "./ProjectileLauncher";

export class HaloProjectileLauncher implements IProjectileCollisionSignaler {
    private currentUpgrade = 0;
    private defaultCooldown = 0;
    private cooldownDivisorPerUpgrade = 0;
    private directions: Vec2[] = [];

    public constructor(
        private launcher: ProjectileLauncher,
        private playerNode: Node,
        settings: HaloLauncherSettings,
        projectileData: ProjectileData
    ) {
        this.defaultCooldown = settings.launcher.cooldown;
        this.cooldownDivisorPerUpgrade = settings.cooldownDivisorPerUpgrade;

        const angle: number = (2 * Math.PI) / settings.projectilesToSpawn;

        for (let i = 0; i < settings.projectilesToSpawn; i++) {
            const x: number = roundToOneDecimal(Math.sin(angle * i));
            const y: number = roundToOneDecimal(Math.cos(angle * i));
            this.directions.push(new Vec2(x, y).normalize());
        }

        launcher.init(settings.launcher, projectileData);
    }

    public get ProjectileCollisionEvent(): ISignal<ProjectileCollision> {
        return this.launcher.ProjectileCollisionEvent;
    }

    public gameTick(deltaTime: number): void {
        if (this.currentUpgrade == 0) return;

        this.launcher.gameTick(deltaTime, this.playerNode.worldPosition, this.directions);
    }

    public upgrade(): void {
        this.currentUpgrade++;
        this.launcher.Cooldown = this.defaultCooldown / (this.cooldownDivisorPerUpgrade * this.currentUpgrade);
    }
}
