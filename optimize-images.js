import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
    try {
        const files = await imagemin(['images/projects/*.png'], {
            destination: 'images/projects/optimized',
            plugins: [
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        });

        console.log('Images optimized:', files.map(f => f.destinationPath));
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
})();
