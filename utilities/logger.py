import logging
import os

class UserLogger:
    def __init__(self, user_id):
        self.user_id = user_id
        self.logger = logging.getLogger(f"UserLogger-{user_id}")
        self.log_history = []
        self.MAX_LOGS = 100

        # Create a file handler and set the level to INFO
        handler = logging.FileHandler(os.path.join(user_id,'AIFiles', 'AI.log'))
        handler.setLevel(logging.INFO)

        # Create a formatter and add it to the handler
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)

        # Add the handler to the logger
        self.logger.addHandler(handler)

    def log(self, msg):
        """Logs a message to the logger and stores it in log_history."""
        self.logger.info(msg)
        self.log_history.append(msg)
        if len(self.log_history) > self.MAX_LOGS:
            self.log_history.pop(0)

    def get_last_logs(self, n=15):
        """Returns the last n log statements from log_history."""
        return self.log_history[-n:]

    def clear_logs(self):
        """Clears the log_history."""
        self.log_history.clear()
