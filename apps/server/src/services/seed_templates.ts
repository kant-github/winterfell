import { prisma } from "@winterfell/database";

export async function seedTemplates() {
  const templates = [
    {
      id: 'todo-contract',
      title: 'Todo Contract',
      description: 'A simple Anchor program for managing todo items.',
      category: 'utility',
      tags: ['todo', 'crud', 'anchor', 'solana'],
      s3_prefix: 'templates/todo-contract',
      anchorVersion: '0.32.1',
      solanaVersion: '1.18.4',
    },
    {
      id: 'counter-contract',
      title: 'Counter Contract',
      description: 'A basic counter program built with Anchor.',
      category: 'example',
      tags: ['counter', 'basic', 'anchor', 'solana'],
      s3_prefix: 'templates/counter-contract',
      anchorVersion: '0.32.1',
      solanaVersion: '1.18.4',
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
  }

  console.log("templates updated");
}
