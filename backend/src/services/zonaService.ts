import { db } from "../database/database.js";

export class ZonaService {
  static async atribuirZonasSequencialmente(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      db.serialize(() => {
        db.all("SELECT id FROM tokens_acesso ORDER BY id ASC", [], (err, garcons: any[]) => {
          if (err) {
            console.error("Erro ao listar garçons para atribuição de zona:", err);
            return reject(err);
          }

          db.all("SELECT DISTINCT zona FROM mesas WHERE zona IS NOT NULL AND zona != '' ORDER BY zona ASC", [], (err2, mesas: any[]) => {
            if (err2) {
              console.error("Erro ao listar zonas para atribuição:", err2);
              return reject(err2);
            }

            const zonas = mesas.map((m: any) => m.zona);
            console.log(`Atribuindo zonas sequencialmente. Garçons: ${garcons?.length || 0}, Zonas: ${zonas.length} (${zonas.join(", ")})`);

            if (zonas.length === 0) {
              db.run("UPDATE tokens_acesso SET zona = NULL", [], (err3) => {
                if (err3) return reject(err3);
                resolve();
              });
              return;
            }

            const totalGarcons = garcons?.length || 0;
            if (totalGarcons === 0) {
              return resolve();
            }

            let atualizacoesPendentes = totalGarcons;
            let erroOcorrido = false;

            garcons.forEach((garcom, index) => {
              const zonaDesignada = zonas[index % zonas.length];
              db.run("UPDATE tokens_acesso SET zona = ? WHERE id = ?", [zonaDesignada, garcom.id], (err4) => {
                if (err4) {
                  console.error(`Erro ao atualizar zona do garçom ${garcom.id}:`, err4);
                  if (!erroOcorrido) {
                    erroOcorrido = true;
                    return reject(err4);
                  }
                }
                atualizacoesPendentes--;
                if (atualizacoesPendentes === 0 && !erroOcorrido) {
                  resolve();
                }
              });
            });
          });
        });
      });
    });
  }
}
