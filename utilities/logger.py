import logging,os

# Create a logger object
logger = logging.getLogger(__name__)

# Create a file handler and set the level to INFO
handler = logging.FileHandler(os.path.join('AIFiles', 'AI.log'))
handler.setLevel(logging.INFO)

# Create a formatter and add it to the handler
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# Add the handler to the logger
logger.addHandler(handler)

# Keep the top 100 logs in memory
log_history = []
MAX_LOGS = 100

def log(msg):
    """Logs a message to the logger and stores it in log_history."""
    logger.info(msg)
    log_history.append(msg)
    if len(log_history) > MAX_LOGS:
        log_history.pop(0)

def get_last_logs(n=15):
    """Returns the last n log statements from log_history."""
    return log_history[-n:]


def clear_logs():
    """Clears the log_history."""
    log_history.clear()
