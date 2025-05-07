export async function fetchBoards() {
    const res = await fetch("/api/projects");
    console.log("Response from /api/projects:", res);
    if (!res.ok) throw new Error("Erreur lors du chargement des projets");
    return res.json();
  }