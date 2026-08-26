/**
 * Usage: npx tsx scripts/create-admin.ts <email> <password> <name>
 * Example: npx tsx scripts/create-admin.ts admin@stopanarque.bj MonMotDePasse123 "Admin"
 */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const adapter = new PrismaLibSql({ url: `file:${path.join(process.cwd(), "dev.db")}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [, , email, password, name] = process.argv;

  if (!email || !password || !name) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password> <name>");
    console.error('Example: npx tsx scripts/create-admin.ts admin@stopanarque.bj "MonMotDePasse123" "Admin"');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Le mot de passe doit faire au moins 8 caractères.");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error(`❌ Un utilisateur avec l'email "${email}" existe déjà.`);
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashed, name, role: "ADMIN" },
  });

  console.log(`✅ Administrateur créé :`);
  console.log(`   ID    : ${user.id}`);
  console.log(`   Email : ${user.email}`);
  console.log(`   Nom   : ${user.name}`);
  console.log(`   Rôle  : ${user.role}`);
  console.log(`\n👉 Connectez-vous sur /admin/login`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
