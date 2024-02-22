export function validateLineUpAgainstFormation(lineUp, formation) {
    const [gk, def, mid, str] = formation.split('-').map(Number);
    const formationCounts = { GK: gk, DEF: def, MID: mid, STR: str };
    const lineUpCounts = { GK: 0, DEF: 0, MID: 0, STR: 0 };

    lineUp.forEach(player => {
        if (lineUpCounts.hasOwnProperty(player.position)) {
            lineUpCounts[player.position]++;
        }
    });

    return Object.keys(formationCounts).every(position => formationCounts[position] === lineUpCounts[position]);
}

