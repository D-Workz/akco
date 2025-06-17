document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.group-row');

    rows.forEach(row => {
        const groupId = row.dataset.group;
        const groupCell = document.querySelector(`.group-cell[data-group="${groupId}"]`);
        console.log('Hover row:', row, '→ Cell found?', !!groupCell);

        row.addEventListener('mouseenter', () => {
            if (groupCell) groupCell.classList.add('hovered');
        });

        row.addEventListener('mouseleave', () => {
            if (groupCell) groupCell.classList.remove('hovered');
        });
    });
});
