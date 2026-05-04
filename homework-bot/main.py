import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes
from homework_parser import parse_homework
from gcal import create_homework_events
from config import TELEGRAM_BOT_TOKEN, GOOGLE_CALENDAR_ID, TIMEZONE

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        text = update.message.text.strip()
        result = parse_homework(text)

        if result is None:
            await update.message.reply_text(
                "When is it due? (e.g. Friday, May 15)\n"
                "Format: <subject> due <date>"
            )
            return

        subject = result["subject"]
        due_date = result["due_date"]

        cal = create_homework_events(
            subject=subject,
            due_date=due_date,
            calendar_id=GOOGLE_CALENDAR_ID,
            timezone=TIMEZONE,
        )

        reply = (
            f"Added: {subject} HW\n"
            f"Due: {due_date.strftime('%a %b %d')}\n"
            f"Study blocks: "
            f"{cal.study_block1_date.strftime('%a %b %d')} · 8-10 PM, "
            f"{cal.study_block2_date.strftime('%a %b %d')} · 8-10 PM\n"
            f"Reminder: {cal.study_block1_date.strftime('%a %b %d')} at 8 PM"
        )
        await update.message.reply_text(reply)

    except Exception as e:
        logger.exception("Unhandled error in handle_message")
        try:
            await update.message.reply_text("Something went wrong. Try again.")
        except Exception:
            pass


def main():
    app = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    logger.info("Bot starting...")
    app.run_polling()


if __name__ == "__main__":
    main()
