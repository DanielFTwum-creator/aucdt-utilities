import pygame
import random

pygame.init()

# Set up the game screen
screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
pygame.display.set_caption("Portal Quest")

# Load character sprite image
sprite_image = pygame.image.load("character.png")

# Set character position and speed
character_x = 100
character_y = 100
character_speed = 1

# Set up the trail
trail_color = (0, 0, 255)
trail_width = 5
trail_points = []

# Set up the eraser trail
eraser_color = (165, 42, 42)
eraser_width = 15
eraser_points = []

# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Update game state
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        # Add a new point to the eraser trail
        eraser_points.append((character_x, character_y))

        # Remove the oldest point if there are more than 50 points in the eraser trail
        if len(eraser_points) > 50:
            eraser_points.pop(0)

        # Move the character to the left
        character_x -= character_speed
               
        

    if keys[pygame.K_RIGHT]:
        # Add a new point to the trail
        trail_points.append((character_x, character_y))

        # Remove the oldest point if there are more than 50 points in the trail
        if len(trail_points) > 50:
            trail_points.pop(0)

        # Move the character to the right
        character_x += character_speed

    if keys[pygame.K_UP]:
                # Add a new point to the trail
        trail_points.append((character_x, character_y))

        # Remove the oldest point if there are more than 50 points in the trail
        if len(trail_points) > 50:
            trail_points.pop(0)

        # Move the character to the right
        character_x += character_speed
        # Move the character up
        character_y -= character_speed

    if keys[pygame.K_DOWN]:
                # Add a new point to the trail
        trail_points.append((character_x, character_y))

        # Remove the oldest point if there are more than 50 points in the trail
        if len(trail_points) > 50:
            trail_points.pop(0)

        # Move the character to the right
        character_x += character_speed
        # Move the character down
        character_y += character_speed

    # Draw the game screen
    screen.fill((255, 255, 255))

    # Draw the eraser trail
    for i in range(len(eraser_points)-1):
        pygame.draw.circle(screen, eraser_color, eraser_points[i], eraser_width//2)

    # Draw the trail
    for i in range(len(trail_points)-1):
        pygame.draw.circle(screen, trail_color, trail_points[i], trail_width//2)

    # Draw the character sprite
    # Create font object
    font = pygame.font.Font(None, 36)
      # Generate a random RGB color for the position text
    text_color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

    # Render position text
    position_text = font.render(f"Position: ({character_x}, {character_y})", True, text_color)

    # Blit position text onto game screen
    screen.blit(position_text, (50, 50))

    screen.blit(sprite_image, (character_x, character_y))

    pygame.display.flip()

pygame.quit()
