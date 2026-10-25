-- Update DNI renewal contact descriptions to mention potential difficulties
UPDATE contacts
SET description = '{
  "es": "Solicita cita previa para renovar tu DNI. En ocasiones pueden poner dificultades, especialmente si el DNI actual está en vigor: insiste en que tus datos han sido filtrados.",
  "gl": "Solicita cita previa para renovar o teu DNI. En ocasións poden poñer dificultades, especialmente se o DNI actual está en vigor: insiste en que os teus datos foron filtrados.",
  "ca": "Sol·licita cita prèvia per renovar el teu DNI. En ocasions poden posar dificultats, especialment si el DNI actual està en vigor: insisteix que les teves dades han estat filtrades.",
  "eu": "Eskatu aurrez hitzordua zure DNIa berritzeko. Batzuetan zailtasunak jar ditzakete, batez ere uneko DNIa indarrean badago: insistitu zure datuak iragazi direla."
}'::jsonb
WHERE id = '07c3fe3a-6cf7-437e-866d-1b67c39cb840';
