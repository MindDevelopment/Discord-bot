import discord
from discord.ext import commands
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the token from the environment variable
TOKEN = os.getenv('DISCORD_TOKEN')

# Define intents
intents = discord.Intents.default()
intents.message_content = True  # Enable the message content

# Create a bot instance with the specified intents
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f'Bot is logged in as {bot.user}')

@bot.command()
async def hello(ctx):
    await ctx.send("Hello!")

# Start the bot
bot.run(TOKEN)
