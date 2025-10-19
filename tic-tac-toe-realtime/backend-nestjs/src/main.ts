import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (allow all origins in LAN)
  app.enableCors({
    origin: true, // Allow all origins
    credentials: true,
  });

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0'); // Listen on all network interfaces

  const localIp = '192.168.1.39'; // Your LAN IP
  console.log(`🚀 Server is running on:`);
  console.log(`   - Local:   http://localhost:${port}`);
  console.log(`   - Network: http://${localIp}:${port}`);
  console.log(`🎮 WebSocket endpoint:`);
  console.log(`   - Local:   ws://localhost:${port}`);
  console.log(`   - Network: ws://${localIp}:${port}`);
}

bootstrap();
