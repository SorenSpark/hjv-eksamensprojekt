// Navnet på nøglen, dataene gemmes under i localStorage.
// Dette skal bruges på alle andre sider, der skal tilgå dataene.
const STORAGE_KEY = 'uploadedJsonData'; 

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('jsonFileInput');
    
    // Tjekker om elementet eksisterer, før vi tilføjer lytteren
    if (!fileInput) {
        console.error("Fejl: Kunne ikke finde inputfeltet med ID 'jsonFileInput'.");
        return;
    }

    // Lytter efter, når en fil er valgt (når indholdet 'ændres')
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const jsonString = e.target.result;
                    
                    // 1. Først validerer vi dataen ved at forsøge at parse den.
                    // Hvis dette mislykkes, er JSON-filen ugyldig.
                    JSON.parse(jsonString);

                    // 2. Hvis valideringen lykkedes, gemmer vi den raw JSON-streng
                    // i browserens LocalStorage.
                    localStorage.setItem(STORAGE_KEY, jsonString);

                    console.log(`SUCCESS: JSON-data fra filen "${file.name}" er gemt i LocalStorage under nøglen: ${STORAGE_KEY}`);

                    // Valgfrit: Nulstil inputfeltet, så samme fil kan vælges igen
                    event.target.value = ''; 

                } catch (error) {
                    console.error("FEJL: Kunne ikke læse filen. Sikr dig, at det er en gyldig JSON-fil.", error);
                    // Fjern gamle data, hvis den nye fil er ugyldig
                    localStorage.removeItem(STORAGE_KEY); 
                }
            };

            // Læs filen som tekst
            reader.readAsText(file);
        } else {
            console.log("Ingen fil valgt.");
        }
    });
});
